// Copyright 2017-2023, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, AlignGroup, HBox, Node, Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

const equilibriumPositionString = MassesAndSpringsStrings.equilibriumPosition;
const massEquilibriumString = MassesAndSpringsStrings.massEquilibrium;
const movableLineString = MassesAndSpringsStrings.movableLine;
const naturalLengthString = MassesAndSpringsStrings.naturalLength;

// constants
const DEFAULT_CONTENT_SPACING = 155;
const TEXT_MAX_WIDTH = 130;

class LineVisibilityNode extends Node {
  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    options = merge( {
      massEquilibrium: false,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'LineVisibilityNode' )
    }, options );

    super( options );

    // Lines added for reference in panel
    const greenLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb(0, 180, 0)', tandem.createTandem( 'greenLine' ) );
    const blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    const redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

    let equilibriumText = new Text( equilibriumPositionString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      tandem: tandem.createTandem( 'equilibriumPositionText' )
    } );

    if ( options.massEquilibrium ) {
      equilibriumText = new Text( massEquilibriumString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: TEXT_MAX_WIDTH,
        tandem: tandem.createTandem( 'equilibriumPositionText' )
      } );
    }

    // Align group used for label align boxes
    const alignGroup = new AlignGroup( { matchVertical: false } );

    // Align boxes used for labels
    const naturalLengthVisibleAlignBox = new AlignBox( new Text( naturalLengthString, {
      font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: TEXT_MAX_WIDTH
    } ), { group: alignGroup, xAlign: 'left' } );
    const equilibriumAlignBox = new AlignBox( equilibriumText, { group: alignGroup, xAlign: 'left' } );
    const movableAlignBox = new AlignBox( new Text( movableLineString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      tandem: tandem.createTandem( 'movableLineText' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Max width must be set to the maxWidth of the alignGroup based on its content.
    const contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

    // Create checkboxes using align boxes above
    const indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      createNode: () => new HBox( { children: [ naturalLengthVisibleAlignBox, blueLine ], spacing: contentSpacing } ),
      property: model.naturalLengthVisibleProperty,
      label: naturalLengthString
    }, {
      createNode: () => new HBox( { children: [ equilibriumAlignBox, greenLine ], spacing: contentSpacing } ),
      property: model.equilibriumPositionVisibleProperty,
      label: equilibriumPositionString
    }, {
      createNode: () => new HBox( { children: [ movableAlignBox, redLine ], spacing: contentSpacing } ),
      property: model.movableLineVisibleProperty,
      label: movableLineString
    } ], {
      checkboxOptions: { spacing: 8, boxWidth: 16 },
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );
    const titleToControlsVerticalSpace = 2;
    const indicatorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( titleToControlsVerticalSpace ),
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    const controlBox = new HBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlsVBox
      ]
    } );
    this.addChild( controlBox );
  }
}

massesAndSprings.register( 'LineVisibilityNode', LineVisibilityNode );

export default LineVisibilityNode;
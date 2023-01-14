// Copyright 2017-2023, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines on vector screen.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import BracketNode from '../../../../scenery-phet/js/BracketNode.js';
import { AlignBox, AlignGroup, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import DisplacementArrowNode from './DisplacementArrowNode.js';

const displacementString = MassesAndSpringsStrings.displacement;
const massEquilibriumString = MassesAndSpringsStrings.massEquilibrium;
const movableLineString = MassesAndSpringsStrings.movableLine;
const naturalLengthString = MassesAndSpringsStrings.naturalLength;
const periodTraceString = MassesAndSpringsStrings.periodTrace;

// constants
const DEFAULT_CONTENT_SPACING = 155;
const CONTENT_MAX_WIDTH = 115;

class IndicatorVisibilityControlNode extends Node {
  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    options = merge( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'indicatorVisibilityControlNode' ),
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 10,
      periodTraceOption: false
    }, options );

    super( options );

    // Lines added for reference in panel
    const blackLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'black', tandem.createTandem( 'blackLine' ) );
    const blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    const redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

    const displacementSymbol = new DisplacementArrowNode(
      new NumberProperty( 10 ),
      new BooleanProperty( true ),
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        symbolRepresentation: true,
        scale: 0.65
      }
    );
    const alignGroup = new AlignGroup( { matchVertical: false } );

    // Labels for the displacement arrow and natural length line
    const displacementLabels = new VBox( {
      spacing: 8,
      align: 'left',
      children: [
        new Text( displacementString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: 110,
          tandem: tandem.createTandem( 'displacementText' )
        } ),
        new Text( naturalLengthString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: 110,
          tandem: tandem.createTandem( 'naturalLengthText' )
        } ) ]
    } );

    // the bracket at the left - this is tweaked a bit for optimal appearance
    const bracket = new VBox( {
      children: [
        new BracketNode( {
          orientation: 'left',
          bracketLength: displacementLabels.height < 17 ? 17 : displacementLabels.height,
          bracketLineWidth: 2,
          bracketStroke: 'black',
          bracketTipPosition: 0.475,
          bracketEndRadius: 4,
          bracketTipRadius: 4
        } )
      ]
    } );

    const componentDisplacement = new AlignBox( new HBox( {
      spacing: 2,
      children: [ bracket, displacementLabels ]
    } ), { xAlign: 'left', group: alignGroup } );

    const massEquilibriumAlignBox = new AlignBox( new Text( massEquilibriumString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: CONTENT_MAX_WIDTH,
      tandem: tandem.createTandem( 'massEquilibriumText' )
    } ), { xAlign: 'left', group: alignGroup } );
    const movableLineAlignBox = new AlignBox( new Text( movableLineString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: CONTENT_MAX_WIDTH,
      tandem: tandem.createTandem( 'movableLineText' )
    } ), { xAlign: 'left', group: alignGroup } );

    // Max width must be set to the maxWidth of the alignGroup based on its content.
    const contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

    // Create checkboxes using align boxes above
    const componentDisplacementVBox = new VBox( { children: [ displacementSymbol, blueLine ] } );
    componentDisplacementVBox.spacing = componentDisplacementVBox.height * 0.75;

    // Used for indicator visibility
    const checkboxContent = [ {
      createNode: () => new HBox( {
        children: [ componentDisplacement, componentDisplacementVBox ],
        spacing: contentSpacing
      } ),
      property: model.naturalLengthVisibleProperty
    }, {
      createNode: () => new HBox( { children: [ massEquilibriumAlignBox, blackLine ], spacing: contentSpacing } ),
      property: model.equilibriumPositionVisibleProperty
    }, {
      createNode: () => new HBox( { children: [ movableLineAlignBox, redLine ], spacing: contentSpacing } ),
      property: model.movableLineVisibleProperty
    } ];

    if ( options.periodTraceOption ) {

      // Push period trace content into checkboxContent
      checkboxContent.push( {
        createNode: tandem => new Text( periodTraceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: CONTENT_MAX_WIDTH,
          tandem: tandem.createTandem( 'periodTraceText' )
        } ),
        property: model.firstSpring.periodTraceVisibilityProperty
      } );
    }
    const indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( checkboxContent, {
      checkboxOptions: {
        boxWidth: 16,
        spacing: 8
      },
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );

    const indicatorVisibilityControlsVBox = new VBox( {
        children: [
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    this.addChild( indicatorVisibilityControlsVBox );
  }
}

massesAndSprings.register( 'IndicatorVisibilityControlNode', IndicatorVisibilityControlNode );

export default IndicatorVisibilityControlNode;
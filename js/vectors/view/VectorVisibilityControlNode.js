// Copyright 2017-2023, University of Colorado Boulder

/**
 * Panel that manages options visibility for vectors and period trace in Basics version.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, AlignGroup, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import ForcesMode from '../../common/model/ForcesMode.js';
import ForceVectorArrow from '../../common/view/ForceVectorArrow.js';
import VectorArrow from '../../common/view/VectorArrow.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';

const accelerationString = MassesAndSpringsStrings.acceleration;
const forcesString = MassesAndSpringsStrings.forces;
const gravityString = MassesAndSpringsStrings.gravity;
const netForceString = MassesAndSpringsStrings.netForce;
const periodTraceString = MassesAndSpringsStrings.periodTrace;
const springString = MassesAndSpringsStrings.spring;
const velocityString = MassesAndSpringsStrings.velocity;

// constants
const MAX_WIDTH = 140;
const DEFAULT_CONTENT_SPACING = 155;

class VectorVisibilityControlNode extends Node {
  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    options = merge( {
      showForces: true,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'vectorVisibilityControlNode' )
    }, options );

    super( options );

    const velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR );
    const accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR );
    const gravityArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR );
    const springArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR );
    const netForceArrow = new ForceVectorArrow( 'black' );

    // Align group used for label align boxes
    const alignGroup = new AlignGroup( { matchVertical: false } );

    // Members of the attributed to the alignGroup are declared in order as they appear in the sim.
    const velocityAlignBox = new AlignBox( new Text( velocityString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'velocityText' )
    } ), { group: alignGroup, xAlign: 'left' } );

    const accelerationAlignBox = new AlignBox( new Text( accelerationString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'accelerationText' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Responsible for forces aquaRadioButton
    const forcesVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      ForcesMode.FORCES,
      new Text( forcesString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'forcesText' )
      } ),
      { radius: 7, spacing: 7 }
    );

    // Indention used for gravity and spring checkbox
    const indentation = 22;

    // Sub group of check boxes indented under forces radio button
    const gravityAlignBox = new AlignBox( new Text( gravityString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH - indentation,
      tandem: tandem.createTandem( 'gravityText' )
    } ), { group: alignGroup, xAlign: 'left' } );
    const springAlignBox = new AlignBox( new Text( springString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH - indentation,
      tandem: tandem.createTandem( 'springText' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // responsible for net force aquaRadioButton
    const netForceAlignBox = new AlignBox( new Text( netForceString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'netForceText' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Max width must be set to the maxWidth of the alignGroup based on its content.
    const contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

    const netForceVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      ForcesMode.NET_FORCES,
      new HBox( { children: [ netForceAlignBox, netForceArrow ], spacing: contentSpacing } ),
      { radius: 7, spacing: 7 }
    );

    // Handle options for checkbox group
    let vectorVisibilityCheckboxGroup;
    const velocityCheckboxObject = {
      createNode: () => new HBox( { children: [ velocityAlignBox, velocityArrow ], spacing: contentSpacing } ),
      property: model.velocityVectorVisibilityProperty,
      label: velocityString
    };
    const accelerationCheckboxObject = {
      createNode: () => new HBox( { children: [ accelerationAlignBox, accelerationArrow ], spacing: contentSpacing } ),
      property: model.accelerationVectorVisibilityProperty,
      label: accelerationString
    };

    if ( !model.basicsVersion ) {
      vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ velocityCheckboxObject, accelerationCheckboxObject ], {
        checkboxOptions: {
          boxWidth: 16,
          spacing: 8
        },
        tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
      } );
    }

    // Responsible for velocity and acceleration vectors checkboxes and period trace in basics version
    else {
      vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
        createNode: tandem => new Text( periodTraceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: MAX_WIDTH,
          tandem: tandem.createTandem( 'periodTraceText' )
        } ),
        property: model.firstSpring.periodTraceVisibilityProperty
      },
        velocityCheckboxObject,
        accelerationCheckboxObject
      ], {
        checkboxOptions: {
          boxWidth: 16,
          spacing: 8
        },
        tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
      } );
    }

    // Property that toggles whether the gravity and spring force checkboxes are enabled
    const enabledProperty = new BooleanProperty( model.forcesModeProperty.value === ForcesMode.FORCES, {
      phetioFeatured: true
    } );

    // Responsible for forces vectors checkboxes
    const forcesVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      createNode: () => new HBox( { children: [ gravityAlignBox, gravityArrow ], spacing: contentSpacing - indentation } ),
      property: model.gravityVectorVisibilityProperty,
      label: gravityString
    }, {
      createNode: () => new HBox( { children: [ springAlignBox, springArrow ], spacing: contentSpacing - indentation } ),
      property: model.springVectorVisibilityProperty,
      label: springString
    } ], {
      checkboxOptions: {
        enabledProperty: enabledProperty,
        boxWidth: 16
      },
      tandem: tandem.createTandem( 'forcesVisibilityCheckboxGroup' )
    } );

    // manages the mutability of the forces checkboxes dependent on the forces and net force aquaRadioButton
    model.forcesModeProperty.link( mode => {
      enabledProperty.set( mode === ForcesMode.FORCES );
    } );

    // Contains all checkboxes and radio buttons for vector visibility
    let vectorVisibilityControlsVBox;

    // groups the checkboxes and forces aquaRadioButton
    if ( options.showForces ) {
      vectorVisibilityControlsVBox = new VBox( {
          children: [
            vectorVisibilityCheckboxGroup,
            forcesVisibilityRadioButton,
            new AlignBox( forcesVisibilityCheckboxGroup, { leftMargin: 22 } ),
            netForceVisibilityRadioButton
          ],
          spacing: 8,
          align: 'left',
          tandem: tandem.createTandem( 'spacingUnit' )
        }
      );
    }
    else {
      vectorVisibilityControlsVBox = new VBox( {
        children: [
          vectorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
      } );
    }
    const controlsHBox = new HBox( {
      spacing: 65,
      children: [
        vectorVisibilityControlsVBox
      ]
    } );
    this.addChild( controlsHBox );
  }
}

massesAndSprings.register( 'VectorVisibilityControlNode', VectorVisibilityControlNode );

export default VectorVisibilityControlNode;